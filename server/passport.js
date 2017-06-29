import passport from 'passport';
import passportFacebook from 'passport-facebook';
import User from './models/User';
import config from './config';

const FacebookStrategy = passportFacebook.Strategy;

function setupFacebook() {
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: ['id', 'name', 'displayName', 'emails', 'photos'],
    passReqToCallback: true,
  }, (req, fbAccessToken, fbRefreshToken, profile, done) => {
    User.findOne({ fbId: profile.id })
      .then((user) => {
        let newUser = user;
        if (!user) {
          newUser = new User();
        }

        Object.assign(newUser, {
          fbAccessToken,
          fbRefreshToken,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails ? profile.emails[0].value : undefined,
          profileImage: (profile.id) ? `//graph.facebook.com/${profile.id}/picture?type=large` : undefined,
        });

        newUser.save(done);
      });
  }));
}

export default function setupPassport(app) {
  // Serialize sessions
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser((id, done) => {
    User.findOne({
      _id: id,
    }, (err, user) => {
      done(err, user);
    });
  });

  setupFacebook();

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect(`/quiz/${req.query.slug}`);
    }
  );

  app.get('/me', (req, res) => {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: 'Not authorized' });
    }
  });
}

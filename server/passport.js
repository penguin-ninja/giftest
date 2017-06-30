import passport from 'passport';
import passportFacebook from 'passport-facebook';
import User from './models/user';
import Quiz from './models/quiz';
import Result from './models/result';
import config from './config';
import generateMorphedImg from './utils/generateMorphedImg';

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
          fbId: profile.id,
          fbAccessToken,
          fbRefreshToken,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails ? profile.emails[0].value : undefined,
          profileImage: (profile.id) ? `https://graph.facebook.com/${profile.id}/picture?type=large` : undefined,
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

  app.get('/auth/facebook', (req, res, next) => {
    passport.authenticate('facebook', {
      callbackURL: `${config.facebook.callbackURL}?slug=${req.query.slug}`,
    })(req, res, next);
  });

  app.get('/auth/facebook/callback',
    (req, res, next) => {
      passport.authenticate('facebook', {
        callbackURL: `${config.facebook.callbackURL}?slug=${req.query.slug}`,
        failureRedirect: '/',
      })(req, res, next);
    },
    (req, res) => {
      const slug = req.query.slug;
      let tmpQuiz;
      Quiz.findOne({ slug })
      .then((quiz) => {
        if (!quiz) {
          throw new Error('Quiz not found with that slug');
        }
        tmpQuiz = quiz;
        const morphParams = {
          background: quiz.backgroundImage,
          custImg2_url: req.user.profileImage,
          custImg3_url: quiz.resultImage,
        };

        return generateMorphedImg(morphParams);
      })
      .then((imgUrl) => {
        const result = new Result({
          user: req.user._id,
          quiz: tmpQuiz._id,
          image: imgUrl,
        });

        return result.save();
      })
      .then((result) => {
        res.redirect(`/quiz/${req.query.slug}/result/${result._id}`);
      })
      .catch((err) => {
        console.error(err); // eslint-disable-line
        res.redirect('/');
      });
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

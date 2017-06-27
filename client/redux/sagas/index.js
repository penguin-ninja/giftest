import homeSaga from 'modules/Home/redux/sagas';

export default function* root() {
  yield []
    .concat(homeSaga);
}

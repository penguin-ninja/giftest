import { fromJS } from 'immutable';

const initialState = fromJS({
  quizzes: [{
    _id: '12345',
    title: 'What Does Your Name Mean In Ancient Times?',
    imageUrl: '//image.nametests.com/cache/images/promote_image/2017/06/19/d315cfe6c52bf30758493e43f09cda07/236eac7069a54c1a93ab7bae8ae2201f.jpg',
  }],
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    default:
  }

  return state;
}

export default homeReducer;

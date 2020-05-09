import firebase from 'firebase';
import db from '../config/firebase';
import uuid from 'uuid';
import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';
import { sendNotification } from './';

export const updatePet = input => {
  return { type: 'UPDATE_PET', payload: input };
};

export const updatePetRace = input => {
  return { type: 'UPDATE_PETRACE', payload: input };
};

export const updateDescription = input => {
  return { type: 'UPDATE_DESCRIPTION', payload: input };
};

export const updatePostPhoto = input => {
  return { type: 'UPDATE_POST_PHOTO', payload: input };
};

export const updateLocation = input => {
  return { type: 'UPDATE_LOCATION', payload: input };
};

export const uploadPost = () => {
  return async (dispatch, getState) => {
    try {
      const { post, user } = getState();
      const id = uuid.v4();
      const upload = {
        id: id,
        postPhoto: post.photo,
        postPet: post.pet || ' ',
        postPetRace: post.petRace || ' ',
        postDescription: post.description || ' ',
        postLocation: post.location || ' ',
        uid: user.uid,
        photo: user.photo || ' ',
        username: user.username,
        likes: [],
        comments: []
      };
      db.collection('posts')
        .doc(id)
        .set(upload);
    } catch (e) {
      console.error(e);
    }
  };
};

export const getPosts = () => {
  return async (dispatch, getState) => {
    try {
      const posts = await db.collection('posts').get();

      let array = [];
      posts.forEach(post => {
        array.push(post.data());
      });
      dispatch({ type: 'GET_POSTS', payload: array });
    } catch (e) {
      alert(e);
    }
  };
};

export const likePost = post => {
  return (dispatch, getState) => {
    const { uid, username, photo } = getState().user;
    try {
      // const home = cloneDeep(getState().post.feed)
      // let newFeed = home.map(item => {
      //   if(item.id === post.id){
      //     item.likes.push(uid)
      //   } return item
      // })
      db.collection('posts')
        .doc(post.id)
        .update({
          likes: firebase.firestore.FieldValue.arrayUnion(uid)
        });
      db.collection('activity')
        .doc()
        .set({
          postId: post.id,
          postPhoto: post.postPhoto,
          likerId: uid,
          likerPhoto: photo,
          likerName: username,
          uid: post.uid,
          date: new Date().getTime(),
          type: 'LIKE'
        });
      dispatch(sendNotification(post.uid, 'Liked Your Photo'));
      // dispatch({type: 'GET_POSTS', payload: newFeed})
      dispatch(getPosts());
    } catch (e) {
      console.error(e);
    }
  };
};

export const unlikePost = post => {
  return async (dispatch, getState) => {
    const { uid } = getState().user;
    try {
      db.collection('posts')
        .doc(post.id)
        .update({
          likes: firebase.firestore.FieldValue.arrayRemove(uid)
        });
      const query = await db
        .collection('activity')
        .where('postId', '==', post.id)
        .where('likerId', '==', uid)
        .get();
      query.forEach(response => {
        response.ref.delete();
      });
      dispatch(getPosts());
    } catch (e) {
      console.error(e);
    }
  };
};

export const getComments = post => {
  return dispatch => {
    dispatch({
      type: 'GET_COMMENTS',
      payload: orderBy(post.comments, 'date', 'desc')
    });
  };
};

export const addComment = (text, post) => {
  return (dispatch, getState) => {
    const { uid, photo, username } = getState().user;
    let comments = cloneDeep(getState().post.comments.reverse());
    try {
      const comment = {
        comment: text,
        commenterId: uid,
        commenterPhoto: photo || '',
        commenterName: username,
        date: new Date().getTime()
      };
      db.collection('posts')
        .doc(post.id)
        .update({
          comments: firebase.firestore.FieldValue.arrayUnion(comment)
        });
      comment.postId = post.id;
      comment.postPhoto = post.postPhoto;
      comment.uid = post.uid;
      comment.type = 'COMMENT';
      comments.push(comment);
      dispatch({ type: 'GET_COMMENTS', payload: comments.reverse() });

      dispatch(sendNotification(post.uid, text));
      db.collection('activity')
        .doc()
        .set(comment);
    } catch (e) {
      console.error(e);
    }
  };
};

export const modifiedPostsResponse = (data: any[]) => {
  return data.map((post: { toObject: () => any }) => {
    const postObj = post.toObject();
    postObj.user_info = postObj.user_id; // rename
    delete postObj.user_id; // remove old field
    return postObj;
  });
};

export const modifiedSinglePostResponse = (post: { toObject: () => any }) => {
  const postObj = post.toObject();
  postObj.user_info = postObj.user_id; // rename
  delete postObj.user_id; // remove old field
  return postObj;
};

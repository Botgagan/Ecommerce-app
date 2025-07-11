// components/CommentSection.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const CommentSection = ({ productId }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const {backendUrl,token} = useContext(ShopContext)

  useEffect(() => {
    axios.get(backendUrl + `/api/comments/${productId}`,{headers:{token}}).then((res) => {
      if (res.data.success) {
        //console.log(res.data);
        setComments(res.data.comments);
      }
    });
  }, [productId,token]);

const submitComment = () => {
  axios.post(
    backendUrl + '/api/comments/add',
    { productId, text: commentText }, // ✅ Payload first
    { headers: { token } } // ✅ Config second
  ).then((res) => {
    if (res.data.success) {
      setComments([...comments, res.data.comment]);
      setCommentText('');
    }
  });
};

  return (
    <div className='mt-10'>
      <h2 className='text-xl font-bold mb-4'>Comments</h2>
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        rows='3'
        className='w-full border p-2'
        placeholder='Write your comment...'
      />
      <button
        onClick={submitComment}
        className='mt-2 bg-black text-white px-4 py-2'
      >
        Submit
      </button>

      <div className='mt-4 flex flex-col gap-3'>
        {comments.map((comment, index) => (
          <div key={index} className='border p-3 rounded text-sm'>
            <p><strong>{comment.user}</strong></p>
            <p>{comment.text}</p>
            <p className='text-xs text-gray-400'>{new Date(comment.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
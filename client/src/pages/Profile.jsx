import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { 
  updateUserStart, 
  updateUserSuccess, 
  updateUserFailure, 
  deleteUserStart, 
  deleteUserSuccess, 
  deleteUserFailure, 
  signOutStart,
  signOutSuccess,
  signOutFailure,
} from '../redux/user/userSlice.js';


export default function Profile() {
  const {currentUser, loading, error} = useSelector((state)=>state.user)
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(()=>{
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);
  

  const handleFileUpload = async(file) =>{
    const storage = getStorage(app);
    const fileName = new Date().getTime + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot)=>{
      const progress = (snapshot.bytesTransferred/ snapshot.totalBytes) *100;
      // console.log('Upload is '+progress+'% done');
      setFilePercentage(Math.round(progress));
    },
    (error)=>{
      setFileUploadError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL) =>{
        setFormData({...formData, avatar: downloadURL})
      })
    },
    );
  }

  const handleChange = (e) =>{
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),   
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async (e) =>{
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:"DELETE",
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message)); 
      return;    
      }
      dispatch(deleteUserSuccess(data));
    } catch(error){
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () =>{
    try{
      dispatch(signOutStart())
      const req = await fetch('/api/auth/signout');
      const data = req.json();
      if(data.success === false){
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    } catch(error){
      dispatch(signOutFailure(error.message))
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input onChange={(e)=>setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
        <img onClick={()=>fileRef.current.click()}
         src={formData.avatar || currentUser.avatar} alt="Profile"
        className='rounded-full h-24 w-24 object-cover cursor-pointer
        self-center mt-2'/> 
        <p className='text-sm self-center'>
        { fileUploadError ? (
          <span className='text-red-700'>Error Image Upload (image must be less than 2 mb)</span> 
        ) :
          filePercentage > 0 && filePercentage < 100 ? (
            <span className='text-slate-700'>
            {`Uploading ${filePercentage}%`}
            </span> 
          ) :
              filePercentage ===100 ? (
                <span className='text-green-700'>
                  Image successfully uploaded!</span>
              ) : (
                    ""
                  )
        }
        
        </p>
        <input type='text' placeholder='username'
        id='username' className='border p-3 rounded-lg' 
        defaultValue={currentUser.username}
        onChange={handleChange}/>

        <input type='email' placeholder='email'
        id='email' className='border p-3 rounded-lg' 
        defaultValue={currentUser.email}
        onChange={handleChange}/>

        <input type='password' placeholder='password'
        id='password' className='border p-3 rounded-lg'
        onChange={handleChange}/>

        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95
         disabled:opacity-80'>
          {loading ? 'Loading...' : 'Update'}
          </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700'>{updateSuccess ? 'User updated successfully!' : ''}</p>
    </div>
  )
}

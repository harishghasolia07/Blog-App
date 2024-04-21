import {IF} from '../url'

const HomePosts = ({post}) => {
  return (
    <div className="w-full flex mt-8 space-x-4">
      {/* left */}
      <div className="w-[35%] h-[200px] flex justify-center items-center">
        <img src={IF+post.photo} alt="Image" className='rounded-sm h-[200px] w-[400px] flex object-cover' />
      </div>
      {/* right */}
      <div className="flex flex-col w-[65%]">
        <h1 className="text-xl font-bold md:mb-1 mb-2 md:text-2xl">
          {post.title}
        </h1>
        <div className="flex mb-2 text-sm font-semibold text-gray-500 items-center justify-between md:mb-4">
          <p>@{post.username}</p>
          <div className="flex space-x-2">
              <p>{new Date(post.updatedAt).toString().slice(0,15)}</p>
              <p>{new Date(post.updatedAt).toString().slice(16,24)}</p>
          </div>
        </div>
        <p className="text-sm md:text-lg">{post.desc.slice(0,300)+"...Read more"}</p>
      </div>

    </div>
  );
};

export default HomePosts;

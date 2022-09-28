import React from 'react'

const Loading = () => {
    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 bg-black/70 z-50'>
            <div className=' text-white w-full h-full flex items-center justify-center'>
                <i className="fa-solid fa-spinner text-5xl animate-spin"></i>
            </div>
        </div>
    )
}

export default Loading
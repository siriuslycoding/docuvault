import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <div className='flex flex-col md:flex-row flex-wrap bg-gray-700 px-6 md:px-10 lg:px-20 '>

            {/* --------- Header Left --------- */}
            <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
                <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
                    DocuVault
                </p>
                <div className='flex flex-col md:flex-row items-center gap-3 text-white text-2xl font-light'>
                    {/* <img className='w-28' src={assets.group_profiles} alt="" /> */}
                    <p>The Digital Library for <br className='hidden sm:block' /> Seamless Document Accessibility</p>
                </div>
                <a href='#speciality' className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-[#595959] text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300'>
                    Go To Library
                </a>
            </div>

            {/* --------- Header Right --------- */}
            <div className='flex flex-col md:w-1/2 relative'>
                <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.img3} alt="" />
            </div>
        </div>
    )
}

export default Header
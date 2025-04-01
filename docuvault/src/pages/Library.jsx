// import React from "react";

// const Library = () => {
//   return (
//     <div className="min-h-screen flex bg-white text-gray-800">
//       {/* Sidebar Filter Section */}
//       <div className="w-64 bg-white min-h-screen p-5 mt-20">
//         <h2 className="text-lg font-semibold mb-4">Filter</h2>
//         <ul className="flex flex-col space-y-3">
//           {["Author", "Education Level", "Language", "Publication"].map((item, index) => (
//             <li
//               key={index}
//               className="p-3 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 cursor-pointer transition"
//             >
//               {item}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 py-5 px-1">
//         {/* Top Scrollable Domains Bar - Now pushed below navbar */}
//         <div className="sticky bg-white z-10 mt-[64px]">
//           <ul className="flex gap-5 overflow-x-auto whitespace-nowrap p-3">
//             {[
//               "All Domains",
//               "Artificial Intelligence",
//               "Cybersecurity",
//               "Cloud Computing",
//               "Blockchain Technology",
//               "Quantum Computing",
//               "Internet of Things",
//               "Data Science",
//               "Web Development",
//             ].map((item, index) => (
//               <li
//                 key={index}
//                 className="px-5 py-3 text-gray-300 bg-gray-700 rounded-lg shadow-md hover:text-white hover:bg-gray-600 cursor-pointer transition"
//               >
//                 {item}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Content Below */}
//         <div className="mt-5 p-6 bg-gray-800 rounded-lg shadow-lg">
//           <h2 className="text-2xl font-semibold">Explore Books & Resources</h2>
//           <p className="text-gray-400 mt-2">
//             Browse and find documents related to various domains.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Library;

import React from "react";

const Library = () => {
  return (
    <div className="min-h-screen flex bg-white text-gray-800 relative custom-scrollbar">
      {/* Permanent Sidebar */}
      <div className="w-64 bg-gray-100 min-h-screen p-5 left-0 top-0 mt-20 shadow-md">
        <h2 className="text-lg font-semibold mb-4">Filter</h2>
        <ul className="flex flex-col space-y-3">
          {["Author", "Education Level", "Language", "Publication"].map((item, index) => (
            <li
              key={index}
              className="p-3 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 cursor-pointer transition"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Scrollable Domains Bar */}
      <div className="fixed top-[80px] left-64 right-0 bg-white z-20 px-4 shadow-md custom-scrollbar">
        <ul className="flex gap-5 whitespace-nowrap p-3">
          {[
            "All Domains",
            "Artificial Intelligence",
            "Cybersecurity",
            "Cloud Computing",
            "Blockchain Technology",
            "Quantum Computing",
            "Internet of Things",
            "Data Science",
            "Web Development",
          ].map((item, index) => (
            <li
              key={index}
              className="px-5 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-md hover:text-white hover:bg-gray-600 cursor-pointer transition"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 mt-40 p-6">
        <h2 className="text-2xl font-semibold">Explore Books & Resources</h2>
        <p className="text-gray-600 mt-2">
          Browse and find documents related to various domains.
        </p>
        <div className="">
          <div className="bg-gray-100 hover:bg-gray-800 text-gray-800 hover:text-white hover:cursor-pointer transition-all duration-300 mt-5 p-4 rounded-lg shadow-lg">
            <p> <span className=" text-xl">PBL Documentation</span> </p>
            <p> <span className="text-sm">Author</span> <span className="font-semibold">Hazel, Anushree, Radha, Madhura</span> </p>
            <p> <span className="text-sm">Publication</span> <span className="font-semibold">PICT</span> </p>
            <p> <span className="text-sm">Language</span> <span className="font-semibold">English</span> </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;

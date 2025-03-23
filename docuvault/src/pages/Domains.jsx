
import React, { useState } from 'react';
const a = [
  {
    title: 'Artificial Intelligence',
    img: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fEFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2V8ZW58MHx8MHx8fDA%3D', // Replace with an AI-generated image URL
    list: ['Subjects', 'Resources'],
    info:"ancd",
    sub:[
    {name: "HTML Basics", link: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    {name: "HTML Basics", link: "https://developer.mozilla.org/en-US/docs/Web/HTML" }
    ]
  },
  {
    title: 'Cybersecurity',
    img: 'https://tse1.mm.bing.net/th?id=OIP.vFZXiFUX08VUgoqT9MZvrgHaE3&pid=Api&P=0&h=180',
    list: ['Threat Analysis', 'Security Tools'],
  },
  {
    title: 'Cloud Computing',
    img: 'https://files.oaiusercontent.com/file-QELBC7YnDiAVpoV3tW2DcQ?se=2025-03-07T18%3A24%3A03Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D2427248e-4ca4-4c56-91b3-4868f0a92307.webp&sig=UhR7gAX3Erd7eNvsUz4QSPkkJQlgpi9pwI9DePkhim4%3D',
    list: ['AWS', 'Google Cloud'],
  },
  {
    title: 'Blockchain Technology',
    img: 'https://tse4.mm.bing.net/th?id=OIP.Vm_2qhj8oCnVDnl4qUXeSQHaE7&pid=Api&P=0&h=180',
    list: ['Smart Contracts', 'Decentralization'],
  },
  {
    title: 'Quantum Computing',
    img: 'https://th.bing.com/th/id/OIP.ZOAsuOBCJv_Pd50ApOLthAHaE8?w=255&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    list: ['Qubits', 'Quantum Supremacy'],
  },
  {
    title: 'Internet of Things (IoT)',
    img: 'https://th.bing.com/th/id/OIP.OWUK5m3mk7w-GLeruSC2cwHaFS?w=240&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    list: ['Smart Devices', 'Embedded Systems'],
  },
  {
    title: 'Data Science',
    img: 'https://th.bing.com/th/id/OIP.0hskNFaeTGIwwjOxLIbs5AHaEo?w=296&h=184&c=7&r=0&o=5&dpr=1.3&pid=1.7',
    list: ['Machine Learning', 'Big Data'],
  },
  {
    title: 'Web Development',
    img: 'https://tse4.mm.bing.net/th?id=OIP.vK2sTEwl57mqQ2_zuWaidwHaE8&pid=Api&P=0&h=180',
    list: ['Frontend', 'Backend'],
  },
];


const Card = ({ title, img, list,info,sub }) => 
  {

        const [isenable , setisenable]=useState(false);

        const handleclick=() =>{
          setisenable(true);
        }

        const close=()=>{
          setisenable(false);
        }


        return (
                      <div className=" cursor-pointer bg-gradient-to-br from-white to-gray-100 rounded-lg  overflow-hidden w-72 transition-all duration-300 transform hover:-translate-y-2  hover:scale-105">
                        <div className="h-48 w-full">
                          <img src={img} alt={title} className="w-full h-full object-cover rounded-t-lg" />
                        </div>

                        <div className="text-white text-xl font-semibold text-center py-3 bg-gradient-to-r from-gray-800 to-gray-800" onClick={handleclick}>
                          {title}
                        </div>

                        <div className="p-4 bg-gray-800">
                          <ul className="list-none space-y-2">
                            {list.map((cur, index) => (
                              <li key={index} className="text-white flex items-center border-b last:border-b-0 pb-2 hover:text-white-800 transition ">
                                <span className="text-white-500 font-bold mr-2">✔</span>
                                {cur}
                              </li>
                            ))}
                          </ul>
                        </div>
          
                       
                                {/* Pop-up */}
                                {isenable && (
                                  <div className="fixed inset-0 z-50 flex items-center justify-center">
                                    <div 
                                      className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                                      onClick={close}
                                    />
                                    <div className="relative bg-white p-6 rounded-lg shadow-2xl w-96 transform transition-all duration-300 scale-100 opacity-100">
                                      <button 
                                        onClick={close} 
                                        className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm transition"
                                      >
                                        ✕
                                      </button>

                                      <div className="text-center text-lg font-semibold mb-4">
                                        {info}
                                      </div>

                                      <ul className="space-y-3">
                                        {sub?.map((subtopic, index) => (
                                          <li key={index} className="transform transition-all duration-200 hover:-translate-y-0.5">
                                            <a 
                                              href={subtopic.link}
                                              className="block p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors"
                                            >
                                              <span className="font-medium">{subtopic.name}</span>
                                              <span className="ml-2 text-gray-400">→</span>
                                            </a>
                                          </li>
                                        ))}
                                      </ul>

                                    
                                    </div>
                                  </div>
                                )}
                        </div>

               
        )


};



function Domains()
 {
  const [search, setSearch] = useState("");
  const fil = a.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative flex-col justify-center shadow-xl flex flex-wrap gap-8 p-30 min-h-screen z-10">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
      >
        <source src="/videos/bg4.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <style>
        {`
          @keyframes slider {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0%);
            }
          }

          @keyframes sliderr {
            0% {
              transform: translateX(50%);
            }
            100% {
              transform: translateX(0%);
            }
          }

          .animate-slider {
            animation: slider 2s ease-out;
            display: inline-block;
          }

          .animate-sliderr {
            animation: sliderr 2s ease-out;
            display: inline-block;
          }

          .centered-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 25vh;
            text-align: center;
          }
        `}
      </style>

      <div className="centered-container flex-col z-10">
        <p className="text-gray-800 font-extrabold text-5xl flex justify-center items-center animate-slider">
          What New Domains Will You Explore Today?
        </p>

        <p className="mt-10 text-gray-600 text-lg animate-sliderr">
          Discover exciting opportunities to expand your skills and knowledge.
        </p>
      </div>

      <div className="flex justify-center mt-7 z-10">
        <form className="flex items-center p-2 rounded-full">
          <input
            type="text"
            placeholder="Search Domains"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-800 w-100 text-white px-4 py-2 rounded-l-full bg-gray-800 transition duration-300"
          />
          <button
            className="px-4 py-2 bg-white text-gray-800 rounded-r-full cursor-pointer hover:bg-gray-800 hover:text-white transition duration-300 border border-black"
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex gap-5 mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-20 z-10">
        {fil.length > 0 ? (
          fil.map((cur, index) => <Card key={index} {...cur} />)
        ) : (
          <p>Domain not found</p>
        )}
      </div>
    </div>
  );
}

export default Domains

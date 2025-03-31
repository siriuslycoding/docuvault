
import React, { useState } from 'react';
const a = [
  {
    title: "Artificial Intelligence",
    img: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=600&auto=format&fit=crop&q=60",
    list: ["Subjects", "Resources"],
    info: "Artificial Intelligence (AI) focuses on building systems that can learn, reason, and act autonomously.",
    sub: [
      { name: "Introduction to AI", link: "https://www.ibm.com/topics/artificial-intelligence" },
      { name: "Machine Learning Basics", link: "https://www.coursera.org/learn/machine-learning" },
      { name: "Deep Learning with TensorFlow", link: "https://www.tensorflow.org/tutorials" },
    ],
  },
  {
    title: "Cybersecurity",
    img: "https://tse1.mm.bing.net/th?id=OIP.vFZXiFUX08VUgoqT9MZvrgHaE3&pid=Api&P=0&h=180",
    list: ["Threat Analysis", "Security Tools"],
    info: "Cybersecurity is the practice of protecting systems, networks, and data from cyber threats.",
    sub: [
      { name: "Cybersecurity Basics", link: "https://www.cybrary.it/course/intro-to-cyber-security/" },
      { name: "OWASP Top 10 Security Risks", link: "https://owasp.org/www-project-top-ten/" },
      { name: "Ethical Hacking", link: "https://www.udemy.com/course/learn-ethical-hacking-from-scratch/" },
    ],
  },
  {
    title: "Cloud Computing",
    img: "https://files.oaiusercontent.com/file-QELBC7YnDiAVpoV3tW2DcQ...",
    list: ["AWS", "Google Cloud"],
    info: "Cloud computing delivers computing services over the internet, including storage, databases, and AI.",
    sub: [
      { name: "AWS Cloud Fundamentals", link: "https://aws.amazon.com/training/course-descriptions/cloud-practitioner-essentials/" },
      { name: "Google Cloud Platform (GCP)", link: "https://cloud.google.com/training" },
      { name: "Microsoft Azure Fundamentals", link: "https://learn.microsoft.com/en-us/certifications/azure-fundamentals/" },
    ],
  },
  {
    title: "Blockchain Technology",
    img: "https://tse4.mm.bing.net/th?id=OIP.Vm_2qhj8oCnVDnl4qUXeSQHaE7&pid=Api&P=0&h=180",
    list: ["Smart Contracts", "Decentralization"],
    info: "Blockchain is a distributed ledger technology that enables secure and transparent transactions.",
    sub: [
      { name: "Blockchain Basics", link: "https://www.ibm.com/topics/blockchain" },
      { name: "Ethereum and Smart Contracts", link: "https://ethereum.org/en/developers/docs/smart-contracts/" },
      { name: "Hyperledger Fabric", link: "https://hyperledger-fabric.readthedocs.io/en/latest/" },
    ],
  },
  {
    title: "Quantum Computing",
    img: "https://th.bing.com/th/id/OIP.ZOAsuOBCJv_Pd50ApOLthAHaE8?w=255&h=180",
    list: ["Qubits", "Quantum Supremacy"],
    info: "Quantum computing uses quantum mechanics to perform computations exponentially faster than classical computers.",
    sub: [
      { name: "Introduction to Quantum Computing", link: "https://quantum-computing.ibm.com/" },
      { name: "Google's Quantum Supremacy", link: "https://ai.googleblog.com/2019/10/quantum-supremacy-using-programmable.html" },
      { name: "Qiskit Tutorials (IBM Quantum)", link: "https://qiskit.org/learn/" },
    ],
  },
  {
    title: "Internet of Things (IoT)",
    img: "https://th.bing.com/th/id/OIP.OWUK5m3mk7w-GLeruSC2cwHaFS?w=240&h=180",
    list: ["Smart Devices", "Embedded Systems"],
    info: "The Internet of Things (IoT) connects physical devices to the internet, enabling data collection and automation.",
    sub: [
      { name: "IoT Basics", link: "https://www.ibm.com/topics/internet-of-things" },
      { name: "Arduino for IoT", link: "https://www.arduino.cc/en/Guide/Introduction" },
      { name: "Raspberry Pi Projects", link: "https://projects.raspberrypi.org/en/" },
    ],
  },
  {
    title: "Data Science",
    img: "https://th.bing.com/th/id/OIP.0hskNFaeTGIwwjOxLIbs5AHaEo?w=296&h=184",
    list: ["Machine Learning", "Big Data"],
    info: "Data Science involves extracting insights from structured and unstructured data using various techniques.",
    sub: [
      { name: "Data Science Roadmap", link: "https://towardsdatascience.com/the-2023-data-science-roadmap-36834cbf50b" },
      { name: "Python for Data Science", link: "https://www.datacamp.com/courses/intro-to-python-for-data-science" },
      { name: "Kaggle Datasets & Competitions", link: "https://www.kaggle.com/datasets" },
    ],
  },
  {
    title: "Web Development",
    img: "https://tse4.mm.bing.net/th?id=OIP.vK2sTEwl57mqQ2_zuWaidwHaE8&pid=Api&P=0&h=180",
    list: ["Frontend", "Backend"],
    info: "Web development focuses on creating websites and web applications using frontend and backend technologies.",
    sub: [
      { name: "HTML, CSS, and JavaScript", link: "https://developer.mozilla.org/en-US/docs/Learn" },
      { name: "React.js Guide", link: "https://react.dev/" },
      { name: "Node.js and Express", link: "https://expressjs.com/" },
    ],
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
                                  <div className="fixed inset-0 z-50 flex items-center justify-center p-5 overflow-scroll  ">
                                    <div 
                                      className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300  "
                                      onClick={close}
                                    />
                                    <div className="relative bg-white p-6 rounded-lg shadow-2xl w-96 max-h-[80vh] overflow-auto transform transition-all duration-300 scale-100 opacity-100 mt-50">
                                      <button 
                                        onClick={close} 
                                        className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm transition mt-2"
                                      >
                                        ✕
                                      </button>

                                      <div className="text-center text-lg font-semibold mb-4 mt-5">
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

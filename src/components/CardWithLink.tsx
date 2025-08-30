import { Link } from "react-router-dom"

const CardWithLink = () => {
    return (
        // <div className="flex flex-col md:flex-row border border-gray-200 rounded-lg">
        //     <div className="w-full pl-2 md:pl-5 xl:pl-40 pr-2 md:pr-5 xl:pr-40 mb-20">
        //     <div className=" flex text-3xl font-sans mb-4 text-left border-b-2 border-grey-500 pl-4">
        //         <div className="">
        //         <p className="text-gray-100 text-2xl sm:text-4xl transition-all duration-400 ease-in-out hover:text-green-500">Reinforcement Learning Basic</p>
        //         </div>
        //     </div>
        //     <p className="text-xl text-gray-400 p-2 text-wrap">
        //         Experience in Conputer Vision, Reinforcement Leanring, and Finance Application.
        //         <br></br>
        //     </p>
        //     </div>
        // </div>

        <div id="home" className="h-sceeen w-full font-quicksand">
        <div>
            <div className="text-gray-500 text-left p-10 md:pl-40 md:pr-40 md:pb-40">
            
            <Link to="/blog/1-rl-fundamentalconcept" className="block  p-6 bg-gray-900  rounded-lg shadow hover:bg-gray-800 dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800">

                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Mastering Reinforcement Learning: How Machines Learn from Rewards and Mistakes</h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">Reinforcement Learning (RL) is the science of decision making. It is about learning the optimal behavior in an environment to obtain maximum reward.</p>

                <p className="pt-4 font-normal text-gray-700 dark:text-gray-400">Uploaded: 2024-12-10 | Author: Leonard Christopher</p>
            </Link>

            </div>
        </div>
    </div>
    )
  }

  export default CardWithLink
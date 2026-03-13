

const MainContent = () => {
    return(
            <div className="items-center gap-4  bg-[#F8F8FB]">

                <div className="text-[50px] font-bold ">
                    Fitness Coaching
                </div>

                <div className="text-[50px] text-[#5B5EF4] font-bold ">
                    that actually works
                </div>

                <div className="text-[15px] text-[#72728A] ">
                    Connect with certified coaches, track every metric that
                    matters, and build habits that last — all in one minimal,
                    powerful platform.
                </div>

                <div className="ml-auto flex items-center gap-6">
                    <button className="bg-[#5B5EF4] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#6A6DF5]">    
                        Start Free Trial
                    </button>
                    <button className="font-medium hover:bg-[#5B5EF4] px-4 py-2 hover:text-white rounded-lg">
                        Browse Coaches
                    </button>
                </div>
                
                <div className="items-center">
                    <div className="text-[25px]">
                        Everything you need to reach your goals
                    </div>
                     <div className="text-[15px] text-[#72728A]">
                        Built for both coaches and clients
                    </div>
                </div> 

                <div className="text-[25px] text-white font-bold w-10 h-10 flex items-center justify-center bg-[#5B5EF4] rounded-lg">
                    βF
                </div>    
            </div>


        
            
    );
};

export default MainContent;


const StickyHeader = () => {
    return(
        <header className="w-full px-6 py-4 bg-[#FFFFFF]">
            <div className="flex items-center gap-4">
                <div className="text-[25px] text-white font-bold w-10 h-10 flex items-center justify-center bg-[#5B5EF4] rounded-lg">
                    βF
                </div>

                <div className="text-[25px] font-bold ">βFit</div>

                <div className="ml-auto flex items-center gap-4">
                    <button className="font-medium hover:bg-[#5B5EF4] hover:text-white px-4 py-2 rounded-lg">
                        Sign in
                    </button>
                    <button className="bg-[#5B5EF4] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#6A6DF5]">    
                        Get Started
                    </button>
                </div>
            </div>
        </header>
    );
};

export default StickyHeader;
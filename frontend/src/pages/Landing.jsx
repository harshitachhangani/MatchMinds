import Navbar from "../components/Navbar";
import graphiics from "../assets/landing_graphics.png";
import { Link } from "react-router-dom";
// import Typist from "react-typist";
import Vision from "../components/Vision";

const Landing = () => {



    return (
        <div className="min-h-screen flex flex-col">
            {/* fix the navbar to the top */}
            <div className="fixed w-full top-0 left-0">
                <Navbar />
            </div>
            <header className="bg-green-100 flex-grow flex items-center justify-center mt-10 p-10">
                <div>
                    <h1 className="text-7xl mb-4 italic">Match Maker OR What </h1> 
                    <p className="text-xl mb-2">
                        We connect professionals to build their dream teams and accomplish
                        projects together.
                    </p>
                    <p className="text-xl mb-2">
                        Streamlines the process of finding compatible team members.
                    </p>
                    <p className="text-xl mb-2 ">
                        By leveraging advanced algorithms and intuitive user interfaces,
                    </p>
                    <p className="text-xl mb-8 ">
                        Match Maker streamlines the process of finding compatible team
                        members and fostering collaboration among participants.
                    </p>
                    <Link to="/login">
                        <button className="bg-green-900 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4 transition duration-500 ease-in-out">
                            Get Started
                        </button>
                    </Link>
                </div>
                <div>
                    <img
                        src={graphiics}
                        className=""
                        style={{ height: "300px" }}
                        alt="Graphics"
                    />
                </div>
            </header>

            <section className="bg-white p-10">
                <h2 className="text-4xl mb-10 italic">Why Choose MatchMaker?</h2>
                <div className="flex gap-6">
                    <div>
                        <h3 className="text-3xl mb-2">Top-tier Teams</h3>
                        <p>
                            With MatchMaker, you can assemble top-tier teams of tech
                            enthusiasts and professionals. We provide a platform for you to
                            connect with experts in various fields to bring your projects to
                            life.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-3xl mb-2">Powerful Tools</h3>
                        <p>
                            MatchMaker offers a suite of powerful tools to help manage your
                            projects. From task tracking to communication tools, we have
                            everything you need to run your projects smoothly and efficiently.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-3xl mb-2">Active Community</h3>
                        <p>
                            Join our active community of professionals. With MatchMaker, you
                            can unlock the power of collaboration, gain insights from experts,
                            and contribute to a community of like-minded individuals.
                        </p>
                    </div>
                </div>
            </section>
            <Vision />
        </div>
    );
};

export default Landing;

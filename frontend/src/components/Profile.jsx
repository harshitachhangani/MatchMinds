import ProfilePic from "../assets/pfp.png";

const Profile = () => {
  return (
    <div className="bg-white ml-10 mt-10 rounded-xl w-1/4 flex flex-col items-center">
      <img
        src={ProfilePic}
        className="rounded-3xl"
        style={{ height: "250px" }}
        alt="Profile"
      />
      <p className="mt-5 text-2xl">John Doe</p>
      <p className="mt-2 text-lg">johndoe@example.com</p>
      <p className="mt-2 text-lg">A short bio about John Doe</p>
    </div>
  );
};

export default Profile;

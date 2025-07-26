export default function GameBoard() {
  return (
    <div className="flex inset-0 flex justify-center items-center">
      <div
        className="w-[60%] h-[40%] bg-gray-200 rounded-lg shadow-lg"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      ></div>
    </div>
  );
}

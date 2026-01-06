import Lottie from "lottie-react";
import error from "/public/assets/lottieFiles/error.json";
import empty from "/public/assets/lottieFiles/empty.json";
import notFound from "/public/assets/lottieFiles/notFound.json";


import styles from "../lottieHandler/styles.module.css";

const { parent, text, textEmpty, moveDown, fullHeight } = styles;

const lottieFilesMap = {
  error,
  empty,
  notFound,
};


export default function LottieHandler({ type, message }) {
  const lottie = lottieFilesMap[type];
  const isSmall = type === "firstLoading" || type === "loading";

  const isEmpty =
    type === "empty" ||
    // type === "success" ||
    type === "notFound" ||
    type === "error";

  const addMargin =
    type === "success" || type === "notFound" || type === "error";

  return (
    <div className={`${parent} ${type === "loading" ? fullHeight : ""}`}>
      <div>
        <Lottie
          animationData={lottie}
          style={
            type === "loading"
              ? { width: "40px" }
              : type === "firstLoading"
                ? { width: "100px" }
                : { width: "320px" }
          }
        />
        {message && (
          <h3
            className={` ${!isEmpty ? text : textEmpty} ${addMargin ? moveDown : ""
              } ${isSmall ? "text-md" : ""} `}
          >
            {message}
          </h3>
        )}
      </div>
    </div>
  );
}
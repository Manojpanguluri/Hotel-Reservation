import React from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

function Loader() {
  return (
    <div style={{ marginTop: "150px" }}>
      <div className="sweet-loading text-center">
        <ScaleLoader
          color="#c5a880"
          loading={true}
          css=""
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
}

export default Loader;

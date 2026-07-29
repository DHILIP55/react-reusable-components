import React, { Component } from "react";
import GradientText from "../components/GradientText";

export class HomePage extends Component {
  render() {
    return (
      <div className="min-h-screen pt-20 bg-black flex justify-center ">
        <h1 className="text-7xl  font-bold text-white">
          <GradientText>
            HI this is customize Gradient Text
          </GradientText>
        </h1>
      </div>
    );
  }
}

export default HomePage;
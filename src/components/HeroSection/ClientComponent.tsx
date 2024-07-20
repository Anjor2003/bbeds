"use client"

import React, { FC } from "react";
import CountUpNumber from "../CountUpNumber/CountUpNumber";

type Props = {
  heading1: React.ReactNode;
  section2: React.ReactNode;
};



const ClientComponent:FC<Props> = (props) => {
  const { heading1, section2 } = props;
  return (
    <section className="flex px-8 sm:px-4 items-center gap-12 container mx-auto">
      <div className="py-10 md:py-0 xl:py-16 h-full">
        {heading1}
        <div className="flex justify-between mt-12">
          <div className="flex gap-3 flex-col items-center justify-center">
            <p className="text-xs lg:text-lg text-center">Stardard Room</p>
            <CountUpNumber endvalue={354} duration={2000} />
          </div>
          <div className="flex gap-3 flex-col items-center justify-center">
            <p className="text-xs lg:text-lg text-center">Luxury Room</p>
            <CountUpNumber endvalue={125} duration={3000} />
          </div>
          <div className="flex gap-3 flex-col items-center justify-center">
            <p className="text-xs lg:text-lg text-center">Suite</p>
            <CountUpNumber endvalue={276} duration={4000} />
          </div>
        </div>
      </div>
      {section2}
    </section>
  );
}

export default ClientComponent
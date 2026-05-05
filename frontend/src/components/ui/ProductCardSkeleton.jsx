import React from "react";

const ProductCardSkeleton = () => {
  return (
    <article className="w-full max-w-[340px] mx-auto rounded-2xl border border-borderColor/70 bg-black overflow-hidden shadow-sm animate-pulse">
      <div className="p-4">
        <div className="h-[220px] rounded-xl bg-backgroundColor/80 border border-borderColor/40" />
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div className="space-y-2">
          <div className="h-5 w-2/3 rounded bg-backgroundColor/80" />
          <div className="h-4 w-full rounded bg-backgroundColor/70" />
          <div className="h-4 w-5/6 rounded bg-backgroundColor/70" />
        </div>

        <div className="flex gap-2">
          <div className="h-6 w-20 rounded-full bg-backgroundColor/70" />
          <div className="h-6 w-16 rounded-full bg-backgroundColor/70" />
        </div>

        <div>
          <div className="h-3 w-12 rounded bg-backgroundColor/70" />
          <div className="h-8 w-24 rounded bg-backgroundColor/80 mt-2" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="h-11 rounded-lg bg-backgroundColor/80" />
          <div className="h-11 rounded-lg bg-backgroundColor/80" />
        </div>
      </div>
    </article>
  );
};

export default ProductCardSkeleton;

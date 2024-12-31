"use client";
import { useMotionValue } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useMotionTemplate, motion } from "framer-motion";
import { cn } from "../lib/utils";

export const EvervaultCard = ({
    text,
    className
}) => {
    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    const [randomString, setRandomString] = useState("");

    useEffect(() => {
        let str = generateRandomString(1500);
        setRandomString(str);
    }, []);

    function onMouseMove({
        currentTarget,
        clientX,
        clientY
    }) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);

        const str = generateRandomString(1500);
        setRandomString(str);
    }

    return (
        (<div
            className={cn(
                "p-1 bg-transparent mx-auto aspect-square flex items-center justify-center w-[90%] h-[90%] relative",
                className
            )}>
            <div
                onMouseMove={onMouseMove}
                className="group rounded-3xl w-full relative overflow-hidden bg-transparent flex items-center justify-center h-full">
                <CardPattern mouseX={mouseX} mouseY={mouseY} randomString={randomString} />
                <div className="relative z-10 flex items-center justify-center">
                    <div
                        className="relative lg:w-44 aspect-square w-36 rounded-full flex items-center justify-center text-white font-bold text-4xl">
                        <div
                            className="absolute w-full aspect-square bg-black/[0.8] blur-sm rounded-full" />
                        <span className="text-white z-20">{text}</span>
                    </div>
                </div>
            </div>
        </div>)
    );
};

export function CardPattern({
    mouseX,
    mouseY,
    randomString
}) {
    let maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
    let style = { maskImage, WebkitMaskImage: maskImage };

    return (
        (<div className="pointer-events-none">
            <div
                className="absolute inset-0 rounded-2xl  [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50"></div>
            <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 to-blue-700 opacity-0  group-hover:opacity-100 backdrop-blur-xl transition duration-500"
                style={style} />
            <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay  group-hover:opacity-100"
                style={style}>
                <p
                    className="absolute inset-x-0 text-xs h-full break-words whitespace-pre-wrap text-white font-mono font-bold transition duration-500">
                    {randomString}
                </p>
            </motion.div>
        </div>)
    );
}

const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const generateRandomString = (length) => {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

export const Icon = ({
    className,
    ...rest
}) => {
    return (
        (<svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={className}
            {...rest}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>)
    );
};

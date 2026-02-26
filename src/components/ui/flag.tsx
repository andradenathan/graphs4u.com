import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface FlagProps extends ComponentProps<"svg"> {
    code: string;
    size?: number;
}

export function Flag({ code, size = 20, className, ...props }: FlagProps) {
    const w = size;
    const h = size * 0.667;

    const shared = twMerge("rounded-sm inline-block shrink-0", className);

    const flags: Record<string, () => React.JSX.Element> = {
        us: () => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 190 100"
                width={w}
                height={h}
                className={shared}
                {...props}
            >
                <rect width="190" height="100" fill="#B22234" />
                <rect y="7.69" width="190" height="7.69" fill="#fff" />
                <rect y="23.08" width="190" height="7.69" fill="#fff" />
                <rect y="38.46" width="190" height="7.69" fill="#fff" />
                <rect y="53.85" width="190" height="7.69" fill="#fff" />
                <rect y="69.23" width="190" height="7.69" fill="#fff" />
                <rect y="84.62" width="190" height="7.69" fill="#fff" />
                <rect width="76" height="53.85" fill="#3C3B6E" />
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <circle
                        key={`r1-${i}`}
                        cx={8 + i * 7.5}
                        cy={5.4}
                        r="1.8"
                        fill="#fff"
                    />
                ))}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <circle
                        key={`r2-${i}`}
                        cx={11.7 + i * 7.5}
                        cy={10.8}
                        r="1.8"
                        fill="#fff"
                    />
                ))}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <circle
                        key={`r3-${i}`}
                        cx={8 + i * 7.5}
                        cy={16.2}
                        r="1.8"
                        fill="#fff"
                    />
                ))}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <circle
                        key={`r4-${i}`}
                        cx={11.7 + i * 7.5}
                        cy={21.6}
                        r="1.8"
                        fill="#fff"
                    />
                ))}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <circle
                        key={`r5-${i}`}
                        cx={8 + i * 7.5}
                        cy={27}
                        r="1.8"
                        fill="#fff"
                    />
                ))}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <circle
                        key={`r6-${i}`}
                        cx={11.7 + i * 7.5}
                        cy={32.4}
                        r="1.8"
                        fill="#fff"
                    />
                ))}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <circle
                        key={`r7-${i}`}
                        cx={8 + i * 7.5}
                        cy={37.8}
                        r="1.8"
                        fill="#fff"
                    />
                ))}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <circle
                        key={`r8-${i}`}
                        cx={11.7 + i * 7.5}
                        cy={43.2}
                        r="1.8"
                        fill="#fff"
                    />
                ))}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <circle
                        key={`r9-${i}`}
                        cx={8 + i * 7.5}
                        cy={48.6}
                        r="1.8"
                        fill="#fff"
                    />
                ))}
            </svg>
        ),
        br: () => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 150 100"
                width={w}
                height={h}
                className={shared}
                {...props}
            >
                <rect width="150" height="100" fill="#009c3b" />
                <polygon points="75,10 140,50 75,90 10,50" fill="#ffdf00" />
                <circle cx="75" cy="50" r="22" fill="#002776" />
                <path
                    d="M53.5,50 Q75,38 96.5,50"
                    stroke="#fff"
                    strokeWidth="2.5"
                    fill="none"
                />
            </svg>
        ),
        es: () => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 150 100"
                width={w}
                height={h}
                className={shared}
                {...props}
            >
                <rect width="150" height="100" fill="#c60b1e" />
                <rect y="25" width="150" height="50" fill="#ffc400" />
            </svg>
        ),
    };

    const FlagSvg = flags[code];
    if (!FlagSvg) return null;
    return <FlagSvg />;
}

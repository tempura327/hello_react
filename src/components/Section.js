// export default function Section({children}){
//     return (
//         <section className="border-2 border-solid border-zinc-400 p-4 m-2">{children}</section>
//     );
// }

import { LevelContext } from "../contexts/LevelContext";

export default function Section({level, children}){
    return (
        <section className="border-2 border-solid border-zinc-400 p-4 m-2">
            <LevelContext.Provider value={level}>
                {children}
            </LevelContext.Provider>
        </section>
    );
}
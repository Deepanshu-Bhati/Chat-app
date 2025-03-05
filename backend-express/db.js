import { PrismaClient } from "@prisma/client";

export const prisma=new PrismaClient();

// const add= async()=>{

//     const user = await prisma.user.create({
//         data: {
//             email: "deeepfdsdffsasddfd@dsfds",
//             firstname: "ddfd",
//             lastname: "dfdfd",  // You can remove this if it's optional
//             password: "deepanshu"
//         }
//     });
//     console.log(user);
// }

// add();
  
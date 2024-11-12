import bcrypytjs from "bcryptjs";

export async function hashPassword(password: string) {
  return await bcrypytjs.hash(password, 10);
}


export async function comparePassword(inputPassword: string, storedPassword: string): Promise<boolean | void> {
  await bcrypytjs.compare(inputPassword, storedPassword);

}

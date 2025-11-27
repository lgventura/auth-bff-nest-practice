/**
 * Script auxiliar para gerar hash bcrypt de senhas
 * Uso: npm run generate-hash
 */

const bcrypt = require("bcrypt");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Digite a senha para gerar o hash: ", (password) => {
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);

  console.log("\n✅ Hash gerado com sucesso!");
  console.log("Hash:", hash);
  console.log("\nAdicione este hash ao arquivo src/data/users.json");

  rl.close();
});

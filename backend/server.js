import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

// Configuração de sessão para armazenar dados de autenticação
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

// Rota inical do fluxo de autenticação com Github
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Callback após o Github redirecionar de volta
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    // Gerar JWT após a autenticação
    const jwtToken = generateJWT(req.user); // Gerando o JWT com os dados do usuário
    res.json({ token: jwtToken }); // Retorna o JWT no corpo da resposta
  }
);

function generateJWT(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
}

app.listen(3000, () => {
  console.log("Server Running at 3000 port");
});

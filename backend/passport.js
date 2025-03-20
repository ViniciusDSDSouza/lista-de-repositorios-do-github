import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

// Estratégia de autenticação no passport
passport.use(
  // Objeto de configuração da estratégia
  // Função callback da estratégia com os dados do usuário
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET_ID,
      callbackURL:
        "https://bookish-guacamole-9rxx6x766x5c49r-5173.app.github.dev/auth/github/callback",
    },
    (accesToken, refreshToken, profile, done) => {
      return done(null, { profile, accessToken });
    }
  )
);

// Define como serão armazenadas as informações do usuário
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;

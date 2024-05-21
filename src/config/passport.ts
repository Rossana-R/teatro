import passport from "passport";
import {Strategy} from "passport-local";
import User from "../model/schemas/user.schema";
import { ComparePassword } from "../model/user.model";
import { matchPassword } from "../utils/password";

passport.use("local.login", new Strategy({
  usernameField: "email",
  passwordField: "password"
}, async (email: string, password: string, done: any) => {
  const user: any | null = await User.findOne({email});

  if (user) {
    const dbPassword: string = user.password;
    const match = await ComparePassword({password, passwordDb: dbPassword});
    if (match) {
      return done(null, user);
    } else {
      console.log(`password`, password);
      return done(null, false, {message: "Verifica tus credenciales. p"});
    }
  } else {
    console.log(`email`, email);

    return done(null, false, {message: "Verifica tus credenciales. e"});
  }
}));

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done: any) => {
  User.findById(id, (err: any, user: any) => {
    done(err, user);
  });
});

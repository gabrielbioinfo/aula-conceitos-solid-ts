"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// roteamento
const app = (0, express_1.default)();
// HTTP [GET, POST, PUT, DELETE]
app.get("/", (req, res) => {
    res.json({
        message: "agora tem resposta!",
    });
});
app.get("/health-check", (req, res) => {
    res.json({
        status: "up",
    });
});
app.listen(3000, () => {
    console.log("Já subi um serve pq nóis é foda!");
});

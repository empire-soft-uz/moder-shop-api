"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subcategories_json_1 = __importDefault(require("./subcategories.json"));
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose.connect("mongodb+srv://MusicAppAdmin:qy13TkfapzJKSH4I@cluster0.bk9hd.mongodb.net/?retryWrites=true&w=majority");
            console.log("database connected");
            subcategories_json_1.default.forEach((subct) => __awaiter(this, void 0, void 0, function* () {
                const cat = yield Category.find();
                console.log(cat);
            }));
        }
        catch (error) {
            console.log(error);
        }
    });
}
start();

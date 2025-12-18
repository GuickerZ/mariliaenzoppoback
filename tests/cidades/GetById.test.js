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
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const jest_setup_1 = require("../jest.setup");
describe('Cidades - GetById', () => {
    it('Busca registro por id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res1 = yield jest_setup_1.testServer
            .post('/cidades')
            .send({ nome: 'Caxias do sul' });
        expect(res1.statusCode).toEqual(http_status_codes_1.StatusCodes.CREATED);
        const resBuscada = yield jest_setup_1.testServer
            .get(`/cidades/${res1.body}`)
            .send();
        expect(resBuscada.statusCode).toEqual(http_status_codes_1.StatusCodes.OK);
        expect(resBuscada.body).toHaveProperty('nome');
    }));
    it('Tenta buscar registro que não existe', () => __awaiter(void 0, void 0, void 0, function* () {
        const res1 = yield jest_setup_1.testServer
            .get('/cidades/99999')
            .send();
        expect(res1.statusCode).toEqual(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res1.body).toHaveProperty('errors.default');
    }));
});

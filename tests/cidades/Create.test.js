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
describe('Cidades - DeleteById', () => {
    it('Apaga registro', () => __awaiter(void 0, void 0, void 0, function* () {
        const res1 = yield jest_setup_1.testServer
            .post('/cidades')
            .send({ nome: 'Caxias do sul' });
        expect(res1.statusCode).toEqual(http_status_codes_1.StatusCodes.CREATED);
        const resApagada = yield jest_setup_1.testServer
            .delete(`/cidades/${res1.body}`)
            .send();
        expect(resApagada.statusCode).toEqual(http_status_codes_1.StatusCodes.NO_CONTENT);
    }));
    it('Tenta apagar registro que não existe', () => __awaiter(void 0, void 0, void 0, function* () {
        const res1 = yield jest_setup_1.testServer
            .delete('/cidades/99999')
            .send();
        expect(res1.statusCode).toEqual(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res1.body).toHaveProperty('errors.default');
    }));
});

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
describe('Cidades - GetAll', () => {
    it('Buscar todos os registros', () => __awaiter(void 0, void 0, void 0, function* () {
        const res1 = yield jest_setup_1.testServer
            .post('/cidades')
            .send({ nome: 'Caxias do sul' });
        expect(res1.statusCode).toEqual(http_status_codes_1.StatusCodes.CREATED);
        const resBuscada = yield jest_setup_1.testServer
            .get('/cidades')
            .send();
        expect(Number(resBuscada.header['x-total-count'])).toBeGreaterThan(0);
        expect(resBuscada.statusCode).toEqual(http_status_codes_1.StatusCodes.OK);
        expect(resBuscada.body.length).toBeGreaterThan(0);
    }));
});

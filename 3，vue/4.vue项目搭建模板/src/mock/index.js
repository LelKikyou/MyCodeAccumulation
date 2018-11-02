import Mock from "mockjs"
import {login} from './data'
Mock.setup({
    timeout: 700
});
Mock.mock(/\/login/,login);
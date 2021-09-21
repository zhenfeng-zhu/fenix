///////////////////////////////////////////////////////////////
// 解释器

import { TokenKind, Scanner, CharStream } from './scanner'
import { Prog, AstDumper } from './ast'
import { Parser } from './parser'
import * as process from 'process'
import * as fs from 'fs'
import { ScopeDumper } from './scope'
import { SemanticAnalyer } from './semantic'
import { Intepretor } from './intepretor'

///////////////////////////////////////////////////主程序/////////////////////////////////////////////////////////////////////

function compileAndRun(program: string) {
    // 源码
    console.log('源码：')
    console.log(program)

    // 词法分析
    console.log('\n词法分析结果')
    let scanner = new Scanner(new CharStream(program))
    while (scanner.peek().kind != TokenKind.EOF) {
        console.log(scanner.next().toString())
    }

    // return

    // 语法分析
    scanner = new Scanner(new CharStream(program)) // 重置，回到开头
    let parser = new Parser(scanner)
    let prog: Prog = parser.parseProg()
    console.log('\n语法分析后的AST：')
    let astDumper = new AstDumper()
    astDumper.visit(prog, '')

    // return

    // 语义分析
    let semanticAnalyer = new SemanticAnalyer()
    semanticAnalyer.execute(prog)
    console.log('\n符号表：')
    new ScopeDumper().visit(prog, '')

    // return

    console.log('\n语义分析后AST，注意变量')
    astDumper.visit(prog, '')

    // return

    if (parser.errors.length > 0 || semanticAnalyer.errors.length > 0) {
        console.log(
            '\n共发现' +
                parser.errors.length +
                '个语法错误' +
                semanticAnalyer.errors.length +
                '个语义错误'
        )
        return
    }

    // 运行程序
    console.log('\n通过AST解释器运行程序：')
    let date1 = new Date()
    let retVal = new Intepretor().visit(prog)
    let date2 = new Date()
    console.log('程序返回值: ' + retVal)
    console.log('耗时：' + (date2.getTime() - date1.getTime()) / 1000 + '秒')
}

function main() {
    // 要求命令行的第三个参数，一定是一个文件名
    // if (process.argv.length < 3) {
    //     console.log('Usage: node ' + process.argv[1] + ' Filename')
    //     process.exit(1)
    // }

    // 读取源码
    let filename = 'a.play' // process.argv[2]
    let data = fs.readFileSync(filename, 'utf8')
    compileAndRun(data)
}

main()

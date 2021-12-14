//获得eval函数中字符串开头与结尾" "的索引
function getIndexInEval(stringInEval) {
  const firstStack = [];
  const lastStack = [];
  for (let i = 0, j = stringInEval.length; i < j; i++) {
    if (stringInEval[i] === "(") {
      firstStack.push(i);
    }
    if (stringInEval[i] === ")") {
      lastStack.push(i);
    }
  }
  return {
    firstIndex: firstStack[0],
    lastIndex: lastStack[lastStack.length - 1],
  };
}

//代替eval中的模板字符串
function replaceStringInEval(stringEval, firstIndex, lastIndex) {
  const subStringFirst = stringEval.substring(0, firstIndex + 1);
  const subStringMiddle = stringEval.substring(firstIndex + 2, lastIndex - 1);
  const subStringLast = stringEval.substring(lastIndex);
  return subStringFirst + "`" + subStringMiddle + "`" + subStringLast;
}

function pub() {
  //制作一个发布订阅的类
  class publishAndSubscribe {
    constructor() {
      this.funs = [];
    }
    //当调取这个函数的时候传入函数的方法状态变为成功
    apply(fun, ...rest) {
      fun._arguments = rest;
      //修改传入的函数的状态为true
      fun.state = true;
      //将函数推入依赖
      this.funs.push(fun);
    }
    //当调取这个函数的时候执行状态为成功的函数
    call() {
      //遍历funs执行状态为成功的函数
      this.funs.forEach((fun) => {
        if (fun.state) {
          fun(...fun._arguments);
        }
        //初始化状态
        fun.state = false;
      });
    }
  }

  class beforeBuildModule extends publishAndSubscribe {
    constructor() {
      super();
      this.funs = [];
    }
  }

  class afterBuildModule extends publishAndSubscribe {
    constructor() {
      super();
      this.funs = [];
    }
  }

  class beforeParse extends publishAndSubscribe {
    constructor() {
      super();
      this.funs = [];
    }
  }

  class afterParse extends publishAndSubscribe {
    constructor() {
      super();
      this.funs = [];
    }
  }

  class beforeEmitFile extends publishAndSubscribe {
    constructor() {
      super();
      this.funs = [];
    }
  }

  class afterEmitFile extends publishAndSubscribe {
    constructor() {
      super();
      this.funs = [];
    }
  }

  class beforeRun extends publishAndSubscribe {
    constructor() {
      super();
      this.funs = [];
    }
  }

  class afterRun extends publishAndSubscribe {
    constructor() {
      super();
      this.funs = [];
    }
  }

  global.beforeBuildModule = new beforeBuildModule();
  global.afterBuildModule = new afterBuildModule();
  global.beforeParse = new beforeParse();
  global.afterParse = new afterParse();
  global.beforeEmitFile = new beforeEmitFile();
  global.afterEmitFile = new afterEmitFile();
  global.beforeRun = new beforeRun();
  global.afterRun = new afterRun();
}

//暴露webpack所用的方法
module.exports = {
  getIndexInEval,
  replaceStringInEval,
  pub
};

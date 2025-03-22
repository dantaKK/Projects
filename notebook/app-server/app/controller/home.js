const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const {id} = ctx.query;
    ctx.body = `hi, eggt ${id}`;

  }
  async user(){
    const {ctx} = this;
    const {id}=ctx.params;
    // controller 调用 service -> 将数据查询交给 service 处理
    const {name,slogen}=await ctx.service.home.user();
    ctx.body = {
      name,
      slogen,
    }
  }


  async add(){
    const {ctx} = this;
    // 请求体
    const {title} = ctx.request.body;
    ctx.body={ title}
   
  }
}

module.exports = HomeController;

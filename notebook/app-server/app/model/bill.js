// model
// orm 不写sql,对象关系映射
module.exports = app => {
  const {STRING,INTEGER}=app.Sequelize;
 
  const Bill = app.model.define('bill',{
    id:{
      type:INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    pay_type:INTEGER,
    amount:STRING(100), // JS不太善于计算，所以用字符串
    date:STRING(100),
    type_id:INTEGER(100),
    type_name:STRING(100),
    user_id:INTEGER(100),
    remark:STRING(100),
    
  })
  return Bill;
};


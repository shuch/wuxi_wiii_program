import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { houseTypesMapper, spaceTypeMapper, customDetailMapper, rankMapper } from '../../utils/convertor';
import { login } from '../../lib/promise';

const cdn = 'http://oh1n1nfk0.bkt.clouddn.com';

Page({
  data: {
    cdn,
  },

  async onLoad(parmas) {
    console.log(parmas);
    const appData = await login();
    const { id: customerId, houseId } = appData;
    const rankRes = await endpoint('rankList', {
      houseId,
      pageNo: 1,
      pageSize: 10,
    });
    let rankList = rankRes.pageModel ? rankRes.pageModel.resultSet : [];
    rankList = rankList.map(rankMapper);
    this.setData({
      houseId,
      customerId,
      rankList,
    });
  },
});

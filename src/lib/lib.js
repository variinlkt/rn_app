export function getDBData({realm, subject, filters}){//获取db中的聊天记录
    let data = realm.objects(subject);
    if(filters){
      data = data.filtered('text CONTAINS "'+filters+'"');
    }
    // data.map(item=>console.log(item))
    return data;
}
export function mapping(subject){//中文学科名对应的英文，用于请求
    const subjectMap = {
      "语文": "chinese",
      "数学": "math",
      "英语": "english",
      "生物": "biology",
      "历史": "history",
      "地理": "geo",
      "政治": "politics",
      "物理": "physics",
      "化学": "chemistry",
    }
    return subjectMap[subject]
}

export function decodeSearchResult(datas){
    let dialogs = [];
    for (let {type, text, id, idx} of datas) {
      dialogs.push({type, text, id, idx})
    }
    return dialogs;
}
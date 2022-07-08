module.exports = function (sequelize, DataTypes){
    let musicList = sequelize.define("MusicList", { // 테이블 생성
        // 시퀄라이즈는 id 자동 생성 (auto_increament)
        rank   : {
            type      : DataTypes.STRING(40),
            allowNull : true, // null 허용
            unique    : true, // 중복 비허용
        },
        artist : {
            type      : DataTypes.STRING(30),
            allowNull : true,
        },
        title  : {
            type      : DataTypes.STRING(100),
            allowNull : true,
        }
    }, {
        sequelize,
        timestamps  : true, // createdAt, udaptedAt 자동 생성
        underscored : false,
        modelName   : 'MusicList', // 모델명
        tableName   : 'music_list', // 테이블명
        // paranoid: true, // deletedAt 자동 생성
        charset : 'utf8', // 한글 입력 설정
        collate : 'utf8_general_ci',
    });
    return musicList;
};

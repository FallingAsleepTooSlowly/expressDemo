var _ = require('lodash')

// 用户信息类
class UserInfoDto {
    constructor(user) {
        // 普通方式
        // this.openid = user.openid
        // this.name = user.name
        // this.roles = user.roles
        // this.portrait = user.portrait

        // 使用 lodash 的 pick 函数筛选想要的字段，再用 Object.assign 将对象中所有可枚举的自有属性复制出来
        const needFields = ['openid', 'name', 'roles', 'portrait']
        Object.assign(this, _.pick(user, needFields))

        // 使用 lodash 的 omit 函数排除不想要的字段，再用 Object.assign 将对象中所有可枚举的自有属性复制出来
        // const noNeedFields = ['password']
        // Object.assign(this, _.omit(user, noNeedFields))
    }

    // 批量转换静态方法
    static fromDataBase(userData) {
        if(Array.isArray(userData)) {
            return userData.map(user => new UserInfoDto(user))
        }
        return new UserInfoDto(userData)
    }
}


// 分页查询专用 DTO
class PaginatedUserInfoDto {
    constructor(users, pagination) {
        this.item  = UserInfoDto.fromDataBase(users)
        this.pagination = {
            currentPage: pagination.page,
            totalPages: pagination.totalPages,
            itemsPerPage: pagination.limit
        }
    }
}

// 使用方式
// const result = new PaginatedUserResponse(users, pagination)

module.exports = {
    UserInfoDto,
    PaginatedUserInfoDto
}
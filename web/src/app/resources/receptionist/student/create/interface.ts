export interface per_info{
    kh_name: string,
    en_name: string,
    avatar: string,
    sex_id: string,
    phone: string,
    id_card_num: string,
    dob: string,
}

export interface born_add{
      province: string,
      district: string,
      commune: string,
      village: string
}

export interface cur_add{
    cur_province_id: string,
    cur_district_id: string,
    cur_commune_id: string,
    cur_village_id: string,
}
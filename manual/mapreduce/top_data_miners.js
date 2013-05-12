db.prod.aggregate(
    [
        { $project : { src_ip: 1 } },
        {
            $group:{
                _id:"$src_ip",
                counts:{ $sum:1 }
            }
        },
        {$sort:{counts:-1}},
        {$limit:20}
    ]
);
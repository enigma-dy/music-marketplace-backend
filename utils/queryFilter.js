export const buildQueryPipeline = (query) => {
    const {
      genre,
      artist,
      minPrice,
      maxPrice,
      releaseDate,
      startDate,
      endDate,
      rating,
      minDuration,
      maxDuration,
      licenseType,
      sort = "releaseDate", 
      order = "desc",     
      page = 1,            
      limit = 10,           
      search,
    } = query;
  
    
    const skip = (page - 1) * limit;
  
  
    const pipeline = [];
  
    
    const matchStage = {
      ...(genre && { genre: genre }),
      ...(artist && { artist: artist }),
      ...(minPrice || maxPrice
        ? { price: { ...(minPrice && { $gte: +minPrice }), ...(maxPrice && { $lte: +maxPrice }) } }
        : {}),
      ...(rating && { rating: { $gte: +rating } }),
      ...(minDuration || maxDuration
        ? { duration: { ...(minDuration && { $gte: +minDuration }), ...(maxDuration && { $lte: +maxDuration }) } }
        : {}),
      ...(licenseType && { licenseType: licenseType }),
      ...(releaseDate && { releaseDate: { $gte: new Date(releaseDate) } }),
      ...(startDate || endDate
        ? {
            createdAt: {
              ...(startDate && { $gte: new Date(startDate) }),
              ...(endDate && { $lte: new Date(endDate) }),
            },
          }
        : {}),
      ...(search && { $text: { $search: search } }), 
    };
  
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }
  
    
    pipeline.push({
      $lookup: {
        from: "genres",
        localField: "genre",
        foreignField: "_id",
        as: "genreDetails",
      },
    });
  
    
    pipeline.push({ $unwind: { path: "$genreDetails", preserveNullAndEmptyArrays: true } });
  
   
    pipeline.push({ $sort: { [sort]: order === "desc" ? -1 : 1 } });
  
    
    pipeline.push({ $skip: skip }, { $limit: +limit });
  
    return pipeline;
  };
  
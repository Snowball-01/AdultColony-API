export interface IVideoData {
  success: boolean;
  data: {
    title: string;
    id: string;
    image: string;
    duration: string;
    views: string;
    rating: string;
    uploaded: string;
    upvoted: string | null;
    downvoted: string | null;
    models: string[];
    tags: string[];
  };
  assets: string[];
  source: string;
}

export interface IXasiatVideoData {
  success: boolean;
  data: {
    title: string;
    id: string;
    image: string;
    duration: string;
    rating: string;
  };
  related_videos: {
    title: string;
    image: string;
    views: string;
    duration: string;
    url: string;
  }[];
  assets: string[];
  source: string;
}

export interface IXhamsterVideoData {
  success: boolean;
  data: {
    title: string;
    id: string;
    image: string;
    duration: string;
    views: string;
    rating: string;
    uploaded: string;
    upvoted: string | null;
    downvoted: string | null;
  };
  related_videos: {
    title: string;
    image: string;
    views: string;
    duration: string;
    url: string;
  }[];
  assets: string[];
  source: string;
}

export interface IEpornerVideoData {
  success: boolean;
  data: {
    title: string;
    link: string;
    image: string;
    views: string;
    duration: string;
    upvote: string;
    downvote: string;
  };
  related_videos: {
    title: string;
    image: string;
    views: string;
    duration: string;
    url: string;
  }[];
  assets: string[];
  source: string;
}

export interface IHentaiCityVideoData {
  success: boolean;
  data: {
    title: string;
    link: string;
    image: string;
    views: string;
    upload_date: string;
    duration: string;
    rating: string;
  };
  episodes: {
    episode: string;
    image: string;
    link: string;
  }[];
  assets: string[];
  source: string;
}

export interface IJavGigaSearchData {
  success: boolean;
  data: {
    title: string;
    id: string;
    image: string;
    upload_date: string;
    code: string;
    duration: string;
    tags: string[];
    description: string;
  };
  assets: string[];
  source: string;
}

export interface IJavTsunamiSearchData {
  success: boolean;
  data: {
    title: string;
    id: string;
    image: string;
    upload_date: string;
    duration: string;
    tags: string[];
    description: string;
  };
  assets: string[];
  source: string;
}

export interface IJavhdTodaySearchData {
  success: boolean;
  data: {
    title: string;
    id: string;
    image: string;
    genre: string[];
    release_date: string;
    country: string;
    tags: string[];
    description: string;
  };
  assets: string[];
  source: string;
}

export interface ISpankBangVideoData {
  success: boolean;
  data: {
    title: string;
    link: string;
    image: string;
    views: string;
    rating: string;
  };
  related_videos: {
    title: string;
    image: string;
    views: string;
    duration: string;
    url: string;
  }[];
  assets: string[];
  source: string;
}

export interface ISearchVideoData {
  success: boolean;
  data: string[];
  source: string;
}

export interface MaybeError {
  message: string;
}

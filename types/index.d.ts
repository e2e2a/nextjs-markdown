export type CreateNodeDTO = {
  userId: string;
  projectId: string;
  parentId?: string | null;
  projects?: IProject[] | [];
  type: string;
  title?: string;
};

export type INode = {
  _id: string;
  userId: string;
  projectId: string;
  parentId: string;
  type: string;
  children: INode[];
  title?: string | null;
  content?: string | null;
  archived?: {
    isArchived: boolean;
    archivedAt?: Date;
    archivedBy?: mongoose.Schema.Types.ObjectId;
  };
};

export type UpdateNodeDTO = Pick<INode, '_id' | 'title' | 'content' | 'archived' | 'userId'>;

export type IProject = {
  _id: string;
  userId: string;
  title: string;
  nodes: INode[];
  members?: string[];
  archived: {
    isArchived: boolean;
    archivedAt?: Date;
    archivedBy?: mongoose.Schema.Types.ObjectId;
  };
};

export type CreateProjectDTO = Partial<IProject>;
export type UpdateProjectDTO = Pick<INode, 'title'>;
export type ProjectPushNodeDTO = Partial<IProject>;

export interface BreadcrumbItem {
  title: string | undefined;
  _id: string;
  parentId: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href?: string;
  type?: string;
  items?: NavItem[];
  isActive?: boolean;
}

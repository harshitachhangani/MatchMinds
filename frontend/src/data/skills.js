export const availableSkills = [
    // All Programming Languages
    "JavaScript", "Python", "Java", "C", "C++", "C#", "PHP", "Ruby", "TypeScript", "Swift", "Kotlin", "Go", "Rust", "Perl", "R", "Dart", 
    "Scala", "Objective-C", "Lua", "VHDL", "MATLAB", "Julia", "Shell Scripting", "VBScript", "ActionScript", "Hack", "F#", "SQL", "COBOL", 
    "Fortran", "Haskell", "Elixir", "Clojure", "Erlang", "Prolog", "Forth", "Tcl", "Groovy", "Crystal", "Hack", "PowerShell", "OCaml", "Xojo",
    
    // Web Development
    "HTML5", "CSS3", "JavaScript ES6+", "React", "ReactJS", "Redux", "Next.js", "Vue.js", "Angular", "Svelte", "Web Components", "Progressive Web Apps",
    "Single Page Applications (SPA)", "GraphQL", "AJAX", "Tailwind CSS", "Bootstrap", "Foundation", "Material-UI", "Ant Design", "Gatsby", "Jekyll", 
    "Hugo", "WebAssembly", "Babel", "Webpack", "Parcel", "SASS", "CSS Modules", "TypeScript", "Node.js", "Express.js", "Vuex", "Socket.io", "Nginx", 
    "Apache", "MongoDB", "MySQL", "PostgreSQL", "SQL Server", "SQLite", "Firebase", "Content Management Systems (CMS)", "WordPress", "Drupal", "Joomla",
    "RESTful APIs", "OAuth2", "JWT", "GraphQL APIs", "WebSockets", "Load Balancing", "Microservices", "Cloud Hosting", "Docker", "Kubernetes", "Git", 
    "GitHub", "GitLab", "CI/CD", "Jenkins", "Docker Compose", "Redis", "Cloudflare", "ElasticSearch", "Cloud Storage", "Nginx", "AWS S3", "AWS EC2", 
    "Azure", "Google Cloud Platform", "Heroku", "Netlify", "Vercel", "Jest", "Mocha", "Chai", "Selenium", "Cypress", "Postman", "GraphQL", "Swagger", 
    "Figma", "Design Systems", "Responsive Web Design", "Cross-Browser Compatibility", "SEO", "Accessibility", "SEO Optimization", "Agile Development", 
    "Microservices", "API Testing", "Serverless Architecture", "Nginx", "API Gateway", "CORS", "OAuth", "JWT Authentication", "GraphQL Security", 
    "Data Binding", "Code Splitting", "Server-Side Rendering (SSR)", "Client-Side Rendering (CSR)", "JSON Web Tokens", "Cloud Functions", "Cloudflare CDN", 
    
    // Machine Learning
    "Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Gradient Descent", "Logistic Regression", "Linear Regression", 
    "Decision Trees", "Random Forests", "SVM (Support Vector Machine)", "K-Means Clustering", "K-Nearest Neighbors", "Naive Bayes", "PCA", "T-SNE",
    "XGBoost", "LightGBM", "CatBoost", "Neural Networks", "Keras", "TensorFlow", "PyTorch", "Scikit-learn", "Statsmodels", "Pandas", "NumPy", 
    "Matplotlib", "Seaborn", "SciPy", "Scalability in ML", "Natural Language Processing (NLP)", "Computer Vision", "Reinforcement Learning", 
    "Data Preprocessing", "Feature Engineering", "Model Evaluation", "Cross-validation", "Hyperparameter Tuning", "SMOTE", "Handling Class Imbalance", 
    "Dimensionality Reduction", "Ensemble Learning", "Hyperparameter Optimization", "AutoML", "Kaggle", "Data Augmentation", "Time Series Analysis", 
    "ARIMA", "LSTM", "GRU", "Boosting", "Bagging", "Ensemble Methods", "Support Vector Machines", "Bayesian Optimization", "Neural Architecture Search", 
    "Recurrent Neural Networks (RNN)", "Long Short-Term Memory (LSTM)", "CNN", "Transfer Learning", "Generative Adversarial Networks (GAN)", "BERT", 
    "GPT", "T5", "XLNet", "Image Classification", "Object Detection", "Semantic Segmentation", "Facial Recognition", "Text Generation", "BERT Fine-Tuning", 
    "Autoencoders", "GANs", "Q-Learning", "Markov Decision Process", "Deep Q-Networks", "Data Mining", "Deep Learning Optimization", "Reinforcement Learning", 
    
    // Deep Learning
    "Convolutional Neural Networks (CNN)", "Generative Adversarial Networks (GAN)", "Autoencoders", "LSTM", "GRU", "RNN", "Deep Reinforcement Learning", 
    "Attention Mechanisms", "Transformers", "Self-Attention", "Multi-Head Attention", "YOLO", "Fast R-CNN", "Faster R-CNN", "ResNet", "Inception Networks", 
    "VGG", "AlexNet", "DeepDream", "Style Transfer", "Variational Autoencoders", "BERT", "GPT-3", "RoBERTa", "XLNet", "Deep Learning in Python", "TensorFlow", 
    "PyTorch", "TensorFlow Lite", "TensorFlow.js", "Keras", "PyTorch Lightning", "Caffe", "Torch", "OpenCV", "CUDA", "cuDNN", "ONNX", "MXNet", 
    "NVIDIA GPUs", "TPUs", "Edge AI", "AI for Edge Devices", "OpenAI Gym", "Stable Baselines", "Markov Decision Process", "Monte Carlo Methods", 
    "Transfer Learning", "Capsule Networks", "Neural Architecture Search", "Deep Learning Frameworks", "Natural Language Processing", "Computer Vision", 
    "Image Processing", "Object Tracking", "Speech Recognition", "Sentiment Analysis", "Speech-to-Text", "Text-to-Speech", "Deep Learning APIs", 
    
    // Cloud
    "AWS", "Google Cloud Platform", "Microsoft Azure", "Amazon EC2", "AWS Lambda", "Azure Functions", "Cloud Storage", "Docker", "Kubernetes", 
    "Elastic Beanstalk", "AWS S3", "Google Firebase", "Heroku", "Netlify", "Vercel", "Azure Blob Storage", "Cloud Foundry", "IBM Cloud", "Cloud Security", 
    "VPC", "Cloud Networking", "Cloud Monitoring", "Cloud Infrastructure", "Cloud Solutions", "Infrastructure as Code (IaC)", "Terraform", "Ansible", 
    "Cloud Migration", "DevOps", "CI/CD", "Jenkins", "GitHub Actions", "GitLab CI", "Continuous Delivery", "Serverless Computing", "Cloud Databases", 
    "MongoDB Atlas", "SQL Database", "Amazon RDS", "Kubernetes Clusters", "Cloud Databases", "Cloud Networking", "Cloud APIs", "Cloud Native", 
    "Cloud Load Balancers", "Serverless Framework", "Google Kubernetes Engine", "AWS CloudFormation", "AWS Fargate", "Cloud Cost Optimization", 
    
    // Blockchain
    "Blockchain", "Ethereum", "Smart Contracts", "Solidity", "Bitcoin", "Cryptocurrency", "DeFi", "Web3", "IPFS", "Hyperledger", "Ethereum Smart Contracts", 
    "Decentralized Applications (DApps)", "Blockchain Architecture", "Consensus Mechanisms", "Proof of Work", "Proof of Stake", "Blockchain Security", 
    "NFTs", "ERC-20", "ERC-721", "Tokens", "Smart Contract Auditing", "Blockchain Development", "Cryptographic Hashing", "Distributed Ledgers", 
    "Cryptocurrency Mining", "Blockchain Platforms", "Binance Smart Chain", "Polkadot", "Cardano", "Blockchain as a Service (BaaS)", "Ripple", "Litecoin", 
    "Blockchain Testing", "Blockchain Network", "Web3.js", "Ethers.js", "Truffle", "Ganache", "IPFS", "Smart Contract Development", "Zero Knowledge Proofs", 
    "Blockchain Governance", "Ethereum 2.0", "Layer 2 Solutions", "Sidechains", "Blockchain for Enterprises", 
    
    // Linux
    "Linux", "Unix", "Bash Scripting", "Shell Scripting", "Linux System Administration", "System Monitoring", "Linux Security", "Linux Networking", 
    "Kernel", "Apache Server", "Nginx Server", "SSH", "Docker on Linux", "Ubuntu", "CentOS", "Debian", "Red Hat", "Fedora", "Linux Permissions", 
    "Filesystem Hierarchy", "System Logs", "Package Management", "APT", "YUM", "RPM", "ZFS", "Firewall Configuration", "SELinux", "IPTables", "Cron Jobs", 
    "Package Managers", "System Services", "Syslog", "Systemd", "Sysctl", "RAID", "Linux Virtualization", "VMWare", "VirtualBox", "Containers", 
    "Kubernetes on Linux", "Linux Network Configuration", "Troubleshooting Linux", "System Hardening", "Linux for DevOps", "Server Management", "Linux Performance Tuning", 
    
    // System Design
    "System Design", "Microservices", "Load Balancing", "Scalability", "High Availability", "Fault Tolerance", "Database Sharding", "Horizontal Scaling", 
    "Vertical Scaling", "CAP Theorem", "Event-Driven Architecture", "CQRS", "API Gateway", "Service-Oriented Architecture (SOA)", "RESTful APIs", "GraphQL APIs", 
    "Message Queues", "Caching", "Redis", "Memcached", "Distributed Systems", "Cloud Architecture", "Data Consistency", "ACID Transactions", "Event Sourcing", 
    "CAP Theorem", "Horizontal/Vertical Scaling", "Caching Strategies", "Database Design", "NoSQL Databases", "SQL Databases", "Microservices Architecture", 
    "Load Balancer Design", "Network Design", "Serverless Architecture", "Stateful Stateless Services", "Event-Driven Systems", "Authentication & Authorization", 
    
    // SDLC (Software Development Lifecycle)
    "Agile", "Scrum", "Kanban", "Waterfall", "DevOps", "Continuous Integration", "Continuous Delivery", "CI/CD", "Version Control", "Git", "GitHub", 
    "GitLab", "Bitbucket", "JIRA", "Trello", "Asana", "Test-Driven Development (TDD)", "Behavior-Driven Development (BDD)", "Unit Testing", "Integration Testing", 
    "End-to-End Testing", "Continuous Deployment", "Sprints", "User Stories", "Backlog Grooming", "Code Reviews", "Pair Programming", "Automated Testing", 
    "Software Design Patterns", "OOP", "SOLID Principles", "MVC", "MVVM", "Design Thinking", "Prototyping", "Wireframing", "Stakeholder Communication", 
    "Release Management", "Project Management", "Project Roadmaps", "Documentation", "Code Quality", "Refactoring", "Technical Debt", "Software Documentation",
  ];
  
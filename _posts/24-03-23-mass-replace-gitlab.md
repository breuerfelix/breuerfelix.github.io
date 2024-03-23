---
layout: post
title: Search and Replace across all Repositories in a GitLab Instance
date: 2024-05-23 09:00:00 +01:00
tags: search-and-replace gitlab instance group mass-replace traverse glab
category: blog
---

We recently introduced container registry mirrors in our kubernetes cluster at containerd level. Since this day, every team specified the pull-through cache directly in the image name like: `image: docker-cache.example.com/library/alpine`. To remove `docker-cache.example.com` as single point of failure, all teams need to change the image name back to `image: docker.io/library/alpine` or `image: alpine`.

A possible solution would be to write a mutating kubernetes webhook which alters the image name for every pod. That would work but it would not change the image in the source code. This solution works ASAP but would lead to inconsistent helm charts.

Before enforcing the new image names via [OPA](), we thought about helping the teams to change the image name instead of blocking their deployments. Manually digging through 200+ services from 40+ teams was not an option. Let the automation begin.

# How to clone a Company

GitLab has a neat CLI tool called `glab` found [here](https://docs.gitlab.com/ee/editor_extensions/gitlab_cli/). With `glab` you can create issues, merge requests, releases and much more from the command line.

In order to modify every repository in our GitLab instance we first need to clone them locally.

```bash
glab repo clone -g <group> -a=false -p --paginate
```

Parameters:
- `-g` allows you to specify the group
- `-a` specify if you want to clone archived repositories
  - since you cannot modify them anyways we do not want to include them
- `-p` preserves namespace and clones them into subdirectories
- `--paginate` makes additional requests in order to fetch **all** repositories

Unfortunately `glab` does not let you specify the git depth for the repositories. In general we would like to have a shallow clone since the history is not important for us and it would reduce network bandwith + disk space a lot.


# Substitution

As already explained we want to replace all occurences of `docker-cache.example.com` with `docker.io`. Since the mirror only applies to container deployed into Kubernetes, our script should only trigger for helm chart files.  
The replacements lets you specify an array in case you have multiple different pull through proxies defined.

```bash
#!/bin/bash
# replace.sh

replacements=(
    # caches
    's/docker-cache.example.com/docker.io/g'
    's/ghcr-cache.example.com/ghcr.io/g'
)

# finds all .yaml and .yml files
# filters out files that include 'gitlab-ci' or 'docker-compose' in their name
for file in $(find $1 -type f -name "*.y*ml" | grep -v "docker-compose" | grep -v "gitlab-ci"); do
    org=$(cat $file)
    mod="$org"

    # loop over replacements
    for pattern in "${replacements[@]}"; do
        mod=$(echo "$mod" | sed "$pattern" 2>/dev/null)
    done

    # only modify the actual file if the content changed
    if [[ "$mod" != "$org" ]]; then
        echo "$file"
        echo "$mod" > $file
    fi
done
```

Run the script:
```bash
bash replace.sh <folder>
```

# Tons of Merge Requests

Some repositories are now containing changes on our local disk. We do not want to manually go through every repository, checking the diff, and pushing it to GitLab. Even worse, clicking hour after hour in the UI in order to create hundreds of merge requests.

Lets write some script:
```bash
#!/bin/bash
# traverse.sh

traverse() {
    # iterate over all items inside the folder given as first arg
    for dir in "$1"/*; do
        # if its not a folder, continue
        if [ ! -d "$dir" ]; then
          continue
        fi

        # if it is not a git repository
        # then recursively call the function again
        if [ ! -d "$dir/.git" ]; then
            echo "Entering $dir"
            traverse "$dir"
            continue
        fi

        # check for git changes
        (cd "$dir" && git diff --quiet)
        git_status=$?

        # just continue if there are not changes
        if [ $git_status -eq 0 ]; then
            continue
        fi

        # enter the folder
        pushd "$dir"
        # push changes to remote
        git checkout -b fix/replace-image-registry
        git add .
        git commit -m "fix: replace image registries" -m "Registry mirrors are set transparent in the kubernetes containerd configuration."
        git push

        # create a merge requests on gitlab
        glab mr create --remove-source-branch --assignee="<YOUR-USERNAME>" --yes --title="feat: replace image registry"

        # leave the folder
        popd
    done
}

traverse $1
```

Run the script:
```bash
bash traverse.sh <folder>
```

Feel free to not blindly execute the script but instead try it step by step. It is easy to comment some parts out and run this script multiple times.

# Review your changes

Every merge requests will create one GitLab TODO in the UI if you assigned yourself with `--assignee` in the `glab` command. That lets you do through all merge requests one by one and review them if needed.  
I personally did this even though it took about an hour for 100 merge requests. It was still faster than doing every step manually because you only have to make manual changes if needed.
